import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';  // Add this line
import { vote } from '../store/actions';
import { color } from '../services/color';

const Poll = ({ poll, vote }) => {
  const answers =
    poll.options &&
    poll.options.map(option => (
      <button
        onClick={() => vote(poll._id, { answer: option.option })}
        className="button"
        key={option._id}>
        {option.option}
      </button>
    ));

  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Remove the existing canvas to clear the chart
      chartRef.current.parentNode.removeChild(chartRef.current);
    }

    if (poll && poll.options && poll.options.length > 0) {
      const canvasNode = document.createElement('canvas');
      chartRef.current = canvasNode;
      document.getElementById('chart-container').appendChild(canvasNode);

      const ctx = canvasNode.getContext('2d');
      const data = {
        labels: poll.options.map(option => option.option),
        datasets: [
          {
            label: poll.question,
            backgroundColor: poll.options.map(option => color()),
            borderColor: '#323643',
            data: poll.options.map(option => option.votes),
          },
        ],
      };

      new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
          legend: {
            display: true,
            position: 'bottom',
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [poll]);

  return (
    <div>
      <h3 className="poll-title">{poll.question}</h3>
      <div className="buttons_center">{answers}</div>
      <div id="chart-container"></div>
    </div>
  );
};

export default connect(
  store => ({
    poll: store.currentPoll,
  }),
  { vote },
)(Poll);