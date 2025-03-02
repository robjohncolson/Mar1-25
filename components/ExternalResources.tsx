import React from 'react';
import { FaYoutube, FaGoogle, FaGamepad, FaExternalLinkAlt, FaGraduationCap, FaBook, FaRobot } from 'react-icons/fa';

type ResourceType = 'youtube' | 'google_drive' | 'blooket' | 'schoology' | 'notebooklm' | 'other';

interface Resource {
  title: string;
  type: ResourceType;
  url: string;
  description?: string;
}

interface ExternalResourcesProps {
  videos?: Resource[];
  practice?: Resource[];
  other?: Resource[];
}

const ExternalResources: React.FC<ExternalResourcesProps> = ({ videos = [], practice = [], other = [] }) => {
  if (videos.length === 0 && practice.length === 0 && other.length === 0) {
    return null;
  }

  const getIcon = (type: ResourceType) => {
    switch (type) {
      case 'youtube':
        return <FaYoutube className="text-red-600 text-xl" />;
      case 'google_drive':
        return <FaGoogle className="text-blue-500 text-xl" />;
      case 'blooket':
        return <FaGamepad className="text-green-500 text-xl" />;
      case 'schoology':
        return <FaGraduationCap className="text-orange-500 text-xl" />;
      case 'notebooklm':
        return <FaRobot className="text-purple-500 text-xl" />;
      default:
        return <FaExternalLinkAlt className="text-gray-500 text-xl" />;
    }
  };

  const getPlatformName = (type: ResourceType) => {
    switch (type) {
      case 'youtube':
        return 'YouTube';
      case 'google_drive':
        return 'Google Drive';
      case 'blooket':
        return 'Blooket';
      case 'schoology':
        return 'Schoology';
      case 'notebooklm':
        return 'NotebookLM';
      default:
        return 'Browser';
    }
  };

  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-3">Video Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <a
                key={index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mac-window p-3 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    {getIcon(video.type)}
                  </div>
                  <div>
                    <h4 className="font-bold">{video.title}</h4>
                    {video.description && (
                      <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                    )}
                    <p className="text-xs text-blue-500 mt-2">
                      Open in {getPlatformName(video.type)}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {practice.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-3">Practice Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practice.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mac-window p-3 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    <p className="text-xs text-blue-500 mt-2">
                      Open in {getPlatformName(item.type)}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-3">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {other.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mac-window p-3 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    <p className="text-xs text-blue-500 mt-2">
                      Open in {getPlatformName(item.type)}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalResources; 