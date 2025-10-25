import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A reusable card component for the Admin Dashboard
 * to display a key statistic.
 *
 * @param {string} title - The title of the stat (e.g., "Total Events")
 * @param {string | number} value - The value of the stat (e.g., 5)
 * @param {string} linkTo - The URL to navigate to on click (e.g., "/admin/events")
 */
const StatCard = ({ title, value, linkTo }) => {
  return (
    <Link
      to={linkTo}
      className="block p-6 bg-surface-light dark:bg-surface-dark rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary truncate">
        {title}
      </p>
      <p className="text-4xl font-bold text-text-light-primary dark:text-text-dark-primary mt-2">
        {value}
      </p>
    </Link>
  );
};

export default StatCard;
