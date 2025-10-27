import React, { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const SizeGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState("shirts")
  const [unit, setUnit] = useState("inches") // inches or cm

  const sizeCharts = {
    shirts: {
      title: "Shirts Size Guide",
      headers: ["Size", "Chest", "Waist", "Shoulder", "Sleeve Length"],
      data: [
        ["XS", "34-36", "28-30", "16.5", "24"],
        ["S", "36-38", "30-32", "17", "24.5"],
        ["M", "38-40", "32-34", "17.5", "25"],
        ["L", "40-42", "34-36", "18", "25.5"],
        ["XL", "42-44", "36-38", "18.5", "26"],
        ["XXL", "44-46", "38-40", "19", "26.5"]
      ]
    },
    pants: {
      title: "Pants Size Guide",
      headers: ["Size", "Waist", "Hip", "Inseam", "Outseam"],
      data: [
        ["28", "28", "36", "30", "40"],
        ["30", "30", "38", "30", "40.5"],
        ["32", "32", "40", "32", "42"],
        ["34", "34", "42", "32", "42.5"],
        ["36", "36", "44", "34", "44"],
        ["38", "38", "46", "34", "44.5"]
      ]
    },
    jackets: {
      title: "Jackets Size Guide",
      headers: ["Size", "Chest", "Waist", "Shoulder", "Sleeve"],
      data: [
        ["XS", "35", "29", "16.5", "24"],
        ["S", "37", "31", "17", "24.5"],
        ["M", "39", "33", "17.5", "25"],
        ["L", "41", "35", "18", "25.5"],
        ["XL", "43", "37", "18.5", "26"],
        ["XXL", "45", "39", "19", "26.5"]
      ]
    }
  }

  const convertToMetric = (value) => {
    if (value.includes("-")) {
      const [min, max] = value.split("-")
      return `${Math.round(parseFloat(min) * 2.54)}-${Math.round(parseFloat(max) * 2.54)}`
    }
    return Math.round(parseFloat(value) * 2.54).toString()
  }

  const getCurrentData = () => {
    const chart = sizeCharts[selectedCategory]
    if (unit === "cm") {
      return {
        ...chart,
        data: chart.data.map(row => [
          row[0], // Size stays the same
          ...row.slice(1).map(measurement => convertToMetric(measurement))
        ])
      }
    }
    return chart
  }

  const measurementTips = [
    {
      title: "Chest",
      description: "Measure around the fullest part of your chest with your arms down.",
      icon: "User"
    },
    {
      title: "Waist",
      description: "Measure around your natural waistline, keeping the tape comfortably loose.",
      icon: "Circle"
    },
    {
      title: "Shoulder",
      description: "Measure from the edge of one shoulder to the edge of the other.",
      icon: "ArrowLeftRight"
    },
    {
      title: "Sleeve",
      description: "Measure from the shoulder seam to your wrist with your arm slightly bent.",
      icon: "ArrowUp"
    }
  ]

  const categories = [
    { id: "shirts", name: "Shirts", icon: "Shirt" },
    { id: "pants", name: "Pants", icon: "Scissors" },
    { id: "jackets", name: "Jackets", icon: "Coat" }
  ]

  const currentChart = getCurrentData()

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal mb-4">
            Size Guide
          </h1>
          <p className="text-lg text-medium-gray max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive sizing charts and measurement guide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h2 className="font-display font-bold text-charcoal mb-4">
                Categories
              </h2>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left ${
                      selectedCategory === category.id
                        ? "bg-bronze text-white"
                        : "text-charcoal hover:bg-light-gray"
                    }`}
                  >
                    <ApperIcon name={category.icon} size={18} />
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-charcoal mb-3">Units</h3>
                <div className="flex gap-2">
                  <Button
                    variant={unit === "inches" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setUnit("inches")}
                  >
                    Inches
                  </Button>
                  <Button
                    variant={unit === "cm" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setUnit("cm")}
                  >
                    CM
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Size Chart */}
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-charcoal">
                  {currentChart.title}
                </h2>
                <span className="text-sm text-medium-gray">
                  All measurements in {unit}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-light-gray">
                      {currentChart.headers.map((header) => (
                        <th key={header} className="text-left py-3 px-4 font-display font-bold text-charcoal">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChart.data.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-light-gray/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-bronze">{row[0]}</td>
                        {row.slice(1).map((cell, cellIndex) => (
                          <td key={cellIndex} className="py-3 px-4 text-medium-gray">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Measurement Tips */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-display font-bold text-charcoal mb-6">
                How to Measure
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {measurementTips.map((tip) => (
                  <div key={tip.title} className="flex gap-4">
                    <div className="bg-bronze/10 p-3 rounded-lg">
                      <ApperIcon name={tip.icon} size={20} className="text-bronze" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-charcoal mb-1">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-medium-gray leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fit Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-charcoal to-bronze rounded-lg p-6 text-white"
            >
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <ApperIcon name="Info" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">
                    Perfect Fit Guarantee
                  </h3>
                  <p className="text-white/90 mb-4">
                    Still not sure about your size? We offer free exchanges within 30 days. 
                    Our customer service team is also available to help you find the perfect fit.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="secondary" className="bg-white text-charcoal hover:bg-white/90">
                      Contact Support
                    </Button>
                    <Button variant="ghost" className="text-white border-white hover:bg-white/10">
                      View Return Policy
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeGuide