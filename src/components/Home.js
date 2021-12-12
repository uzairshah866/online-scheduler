import React, { useState, useEffect } from 'react'
import { dataset } from './data'
import './Home.css'

const Home = () => {
  const [data, setData] = useState(dataset)
  const [time, setTime] = useState({})

  const days = [0, 1, 2, 3, 4, 5, 6]

  useEffect(() => {
    const newA = data.sort((a, b) => a.name.localeCompare(b.name))
    setData([...newA])
  }, [])

  useEffect(() => {
    let times = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    }
    data.map((person) => {
      const { name, shifts } = person
      times = { ...times, [name]: 0 }
      shifts.map((shift) => {
        times = {
          ...times,
          [shift.day]:
            times[shift.day] + getTimeDiff(shift.start_at, shift.end_at),
          [name]: times[name] + getTimeDiff(shift.start_at, shift.end_at),
        }
      })
    })

    setTime(times)
  }, [])

  const handleFilter = (evt) => {
    // Filter method on base of name more can be added
    const type = evt.target.value
    switch (type) {
      case 'Fname':
        const newA = data.sort((a, b) => a.name.localeCompare(b.name))
        setData([...newA])
        break
      case 'Lname':
        const newB = data.sort((a, b) =>
          a.name.split(' ').pop().localeCompare(b.name.split(' ').pop()),
        )
        setData([...newB])
        break
      default:
        break
    }
  }
  // Time difference
  const getTimeDiff = (start, stop) => {
    const startTime =
      start.slice(0, -2) + ':00 ' + start.slice(-2).toUpperCase()
    const endTime = stop.slice(0, -2) + ':00 ' + stop.slice(-2).toUpperCase()
    var timeStart = new Date('01/01/2007 ' + startTime).getHours()
    var timeEnd = new Date('01/01/2007 ' + endTime).getHours()
    let diff = timeEnd - timeStart
    diff = Math.abs(diff) > 12 ? Math.abs(diff) - 10 : diff
    return diff
  }

  return (
    // Sheduler Wrapper for Full Table
    <div className="schedulerWrapper">
      <div className="filter">
        <p>Sort by</p>
        <div className="filter-wrapper">
          <select onChange={handleFilter} className="arrows">
            <option value="Fname">First Name</option>
            <option value="Lname">Last Name</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="scheduler">
        <table className="table scheduleTable">
          <thead>
            {/* Top row with Headings */}
            <tr>
              <th className="cells"></th>
              <th className="cells">Sun ({time['0']} hrs)</th>
              <th className="cells">Mon ({time['1']} hrs)</th>
              <th className="cells">Tue ({time['2']} hrs)</th>
              <th className="cells">Wed ({time['3']} hrs)</th>
              <th className="cells">Thu ({time['4']} hrs)</th>
              <th className="cells">Fri ({time['5']} hrs)</th>
              <th className="cells">Sat ({time['6']} hrs)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => (
              <>
                {/* Multiple Rows With Different Users */}
                <tr key={index}>
                  <>
                    {/* Row Data of Name Field*/}
                    <td className="cellValue">
                      {d.name} ({time[d.name]} hrs)
                    </td>
                    {/* 7 days array map*/}
                    {days.map((day, index) => {
                      return (
                        <td key={index} className="cellValue">
                          {/*Map on shifts of users and compare with days to map in table*/}
                          {d &&
                            d.shifts &&
                            d.shifts.map((schedule, index) => {
                              return schedule.day === day ? (
                                <div
                                  key={index}
                                  style={{ backgroundColor: schedule.color }}
                                  className="tableItem"
                                >
                                  <span>
                                    {schedule.start_at} - {schedule.end_at}
                                  </span>
                                  <span>{schedule.role}</span>
                                </div>
                              ) : (
                                ''
                              )
                            })}
                        </td>
                      )
                    })}
                  </>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home
