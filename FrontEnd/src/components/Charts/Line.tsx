import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { apiurl } from '../../context/apiurl'

interface FinancialData {
  day: string
  spendings: number
  earnings: number
  'earnings-spendings': number
}

const FinancialChart = () => {
  const [financialData, setFinancialData] = useState<FinancialData[] | null>(
    null
  )

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${apiurl}/api/rides/Financials`, {
        withCredentials: true
      })

      // Assuming the date format is 'DD/MM/YYYY'
      const sortedData = response.data.data.sort(
        (a: FinancialData, b: FinancialData) =>
          new Date(a.day).getTime() - new Date(b.day).getTime()
      )

      let cumulativeSum = 0
      const cumulativeData = sortedData.map((item: FinancialData) => {
        cumulativeSum += item.earnings - item.spendings
        return {
          ...item,
          day: item.day, // Format the date if needed
          'earnings-spendings': cumulativeSum
        }
      })

      setFinancialData(cumulativeData)
    }

    fetchData()
  }, [])

  if (!financialData) {
    return <div>Loading...</div>
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as FinancialData
      return (
        <div className="custom-tooltip">
          <p>{`Day: ${data.day}`}</p>
          <p>{`Earnings: ${data.earnings}`}</p>
          <p>{`Spendings: ${data.spendings}`}</p>
          {/* <p>{`Earnings - Spendings: ${data['earnings-spendings']}`}</p> */}
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart width={500} height={300} data={financialData}>
        <XAxis dataKey="day" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="earnings-spendings"
          stroke="#8884d8"
          name="Earnings - Spendings"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default FinancialChart
