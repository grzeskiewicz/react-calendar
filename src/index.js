import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Calendar extends React.Component {
    constructor(props) {
        super(props);
    }

    createCalendar(year, month) {
        const results = [];
        // find out first and last days of the month
        const firstDate = new Date(year, month, 1); //first day of the month
        const lastDate = new Date(year, month + 1, 0); //last day of month
        // calculate first monday and last sunday
        const firstMonday = this.getFirstMonday(firstDate);
        const lastSunday = this.getLastSunday(lastDate);

        // iterate days starting from first monday
        let iterator = new Date(firstMonday);
        let i = 0;

        // ..until last sunday
        while (iterator <= lastSunday) {
            if (i++ % 7 === 0) {
                // start new week when monday
                var week = [];
                results.push(week);
            }
            // push day to week
            week.push({
                date: new Date(iterator),
                before: iterator < firstDate, // add indicator if before current month
                after: iterator > lastDate // add indicator if after current month
            });
            // iterate to next day
            iterator.setDate(iterator.getDate() + 1);
        }
        //selectedMonth = month;
        return results;
    }

    fixMonday(day) {
        day || (day = 7);
        return --day;
    }

    getFirstMonday(firstDate) { //first monday closest to 1st day of mondth
        const offset = this.fixMonday(firstDate.getDay()); //how many days from 1st to monday

        const result = new Date(firstDate);
        result.setDate(firstDate.getDate() - offset); //create first monday : 1st day of the month - offset
        return result;
    }

    getLastSunday(lastDate) {
        const offset = 6 - this.fixMonday(lastDate.getDay()); //how many days till monday (6-dayOfTheWeek -1)

        const result = new Date(lastDate);
        result.setDate(lastDate.getDate() + offset); //last possible sunday after last day of the month

        return result;
    }

    render() {
        const MONTH_NAMES = 'January February March April May June July August September October November December'.split(' ');
        const weekdays = 'Mo Tu We Th Fr Sa Su'.split(' ');
        const yearNow = new Date().getFullYear();
        const monthNow = new Date().getMonth();
        const today = new Date();
        const calendar = this.createCalendar(yearNow, monthNow);
        
        const week = weekdays.map((day, index) => {
            return <td key={index}>{day}</td>
        });

        const renderMonth = calendar.map((week, index) => {
            let renderWeek = week.map((day, index2) => {
                let className =
                    (day.date < today ? 'not-selectable' : '')
                    + ' ' + ((day.date.getMonth() === today.getMonth() && day.date.getDate() === today.getDate()) ? 'today' : '')
                    + ' ' + (day.before === true ? 'before' : 'after')
                if (className.includes("today")) {
                    className = className.replace('not-selectable', '');
                }
                return (
                    <td key={index2} date={day.date} className={className}>{day.date.getDate()}</td>
                );
            });

            return (
                <tr key={index}>{renderWeek}</tr>
            );
        });

        return (
            <div id="calendar">
                <div>
                <p>{MONTH_NAMES[monthNow]}</p>
                </div>
                <table>
                    <thead><tr>{week}</tr></thead>
                    <tbody>{renderMonth}</tbody>
                </table>
            </div>
        );

    }

}


ReactDOM.render(<Calendar />, document.getElementById('root'));