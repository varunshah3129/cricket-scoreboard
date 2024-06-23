import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../css/News.css';
import { fetchNews, fetchNewsDetails } from '../api/apiClient';

const News: React.FC = () => {
    const [newsData, setNewsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedStoryId, setExpandedStoryId] = useState<number | null>(null);
    const [newsDetails, setNewsDetails] = useState<any>(null);

    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            try {
                const result = await fetchNews();
                setNewsData(result.storyList.filter((item: any) => item.story)); // Filter out ads and other non-story items
            } catch (error) {
                console.error('Error fetching news:', error);
            }
            setLoading(false);
        };

        loadNews();
    }, []);

    const toggleExpand = async (id: number) => {
        if (expandedStoryId === id) {
            setExpandedStoryId(null);
            setNewsDetails(null);
        } else {
            setExpandedStoryId(id);
            try {
                const details = await fetchNewsDetails(id);
                setNewsDetails(details);
            } catch (error) {
                console.error('Error fetching news details:', error);
            }
        }
    };

    const cleanContentValue = (contentValue: string) => {
        return contentValue
            .replace(/@\w+\$\s*-\s*/, '') // Remove placeholders like @B0$ -
            .replace(/@\w+\$/g, '') // Remove other placeholders like @B0$
            .replace(/wjJ4Xrqreve/g, '') // Remove any occurrences of wjJ4Xrqreve
            .trim(); // Trim whitespace
    };

    return (
        <div className="news-container">
            {loading ? (
                <div className="spinner-container">
                    <FontAwesomeIcon icon={faSpinner} spin />
                </div>
            ) : (
                newsData.map((item: any) => (
                    <div key={item.story.id} className={`news-card ${expandedStoryId === item.story.id ? 'expanded' : ''}`}>
                        <div className="news-header" onClick={() => toggleExpand(item.story.id)}>
                            <img src={`https://www.cricbuzz.com/a/img/v1/300x300/i1/c${item.story.imageId}/image.jpg`} alt={item.story.hline} className="news-thumbnail" />
                            <div className="news-summary-container">
                                <h2 className="news-title">{item.story.hline}</h2>
                                <div className="news-summary">{item.story.intro}</div>
                            </div>
                            <FontAwesomeIcon icon={expandedStoryId === item.story.id ? faCircleChevronUp : faCircleChevronDown} className="expand-icon" />
                        </div>
                        {expandedStoryId === item.story.id && newsDetails && (
                            <div className="news-details-content">
                                <p>{newsDetails.context}</p>
                                <p>Published on: {new Date(Number(newsDetails.publishTime)).toLocaleString()}</p>
                                {newsDetails.content.map((contentItem: any, index: number) => (
                                    contentItem.content?.contentValue && contentItem.content.contentType !== 'table' ?
                                        <p key={index}>{cleanContentValue(contentItem.content.contentValue)}</p> : null
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default News;
