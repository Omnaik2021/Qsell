import React, { useState, useEffect } from 'react';
import './App.css';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupOption, setGroupOption] = useState('status');
  const [sortOption, setSortOption] = useState('priority');

  useEffect(() => {
    // Fetch data from the API
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(apiData => {
        setTickets(apiData.tickets);
        setUsers(apiData.users);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleGroupChange = event => {
    setGroupOption(event.target.value);
  };

  const handleSortChange = event => {
    setSortOption(event.target.value);
  };

  const groupByStatus = () => {
    const groupedByStatus = {};
    tickets.forEach(ticket => {
      if (!groupedByStatus[ticket.status]) {
        groupedByStatus[ticket.status] = [];
      }
      groupedByStatus[ticket.status].push(ticket);
    });
    return groupedByStatus;
  };

  const groupByUser = () => {
    const groupedByUser = {};
    tickets.forEach(ticket => {
      const user = users.find(user => user.id === ticket.userId);
      if (user) {
        const userName = user.name;
        if (!groupedByUser[userName]) {
          groupedByUser[userName] = [];
        }
        groupedByUser[userName].push(ticket);
      }
    });
    return groupedByUser;
  };

  const groupByPriority = () => {
    const groupedByPriority = {};
    tickets.forEach(ticket => {
      if (!groupedByPriority[ticket.priority]) {
        groupedByPriority[ticket.priority] = [];
      }
      groupedByPriority[ticket.priority].push(ticket);
    });
    return groupedByPriority;
  };

  const getGroupedTickets = () => {
    if (groupOption === 'status') {
      return groupByStatus();
    } else if (groupOption === 'user') {
      return groupByUser();
    } else if (groupOption === 'priority') {
      return groupByPriority();
    }
    return {};
  };

  const sortedTickets = {};
  const groupedTickets = getGroupedTickets();

  Object.keys(groupedTickets).forEach(groupKey => {
    sortedTickets[groupKey] = groupedTickets[groupKey].sort((a, b) => {
      if (sortOption === 'priority') {
        return b.priority - a.priority;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  });

  return (
    <div>
      <nav className="kanban-navbar">
        {/* Kanban Model Navbar */}
        <div className="navbar-content">KANBAN MODEL</div>
      </nav>
      <div className="control-container">
        {/* Dropdowns for Grouping and Sorting */}
        <div className="dropdown">
          <label htmlFor="groupOption">Grouping:</label>
          <select
            id="groupOption"
            value={groupOption}
            onChange={handleGroupChange}
          >
            <option value="status">By Status</option>
            <option value="user">By User</option>
            <option value="priority">By Priority</option>
          </select>
        </div>
        <div className="dropdown">
          <label htmlFor="sortOption">Sorting:</label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      {/* Kanban Board */}
      <div className="kanban-board">
        {Object.keys(sortedTickets).map(groupKey => (
          <div key={groupKey} className="column">
            <h2 className="column-title">{groupKey}</h2>
            <ul className="task-list">
              {sortedTickets[groupKey]?.map(ticket => (
                <li key={ticket.id} className="task">
                  <strong>{ticket.title}</strong>
                  <p>Priority: {ticket.priority}</p>
                  <p>User: {users.find(user => user.id === ticket.userId)?.name}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
