export const options = {
  chart: {
    animations: { enabled: true },
    toolbar: { show: false },
  },
  grid: {
    show: true,
    borderColor: "#686868",
    strokeDashArray: 2,
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: "#2FD070",
        downward: "#D02F2F"
      },
    }
  },
  xaxis: {
    type: "datetime",
    labels: {
      show: true,
      style: {
        colors: "#686868",
        fontSize: "12px",
        fontFamily: "Lexend",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: true,
      stroke: {
        color: '#686868',
        width: 1,
        dashArray: 0,
      },
    },
    tooltip: {
      enabled: false,
    }
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        colors: "#686868",
        fontSize: "14px",
        fontFamily: "Lexend",
      },
    },
    crosshairs: {
      show: true,
      stroke: {
        color: '#686868',
        width: 1,
        dashArray: 0,
      },
    },
  },
  tooltip: {
    enabled: true,
    theme: false,
    style: {
      fontSize: "12px",
      fontFamily: "Lexend"
    },
  },
}

// Dummy data for price chart

export const series = [
  {
    data: [
      { x: new Date(2025, 0, 1), y: [6593.34, 6600, 6582.63, 6600.00] },
      { x: new Date(2025, 0, 2), y: [6600, 6604.76, 6590.73, 6593.86] },
      { x: new Date(2025, 0, 3), y: [6593.86, 6625.76, 6590.73, 6620.00] },
      { x: new Date(2025, 0, 4), y: [6620.00, 6604.76, 6590.73, 6605.86] },
      { x: new Date(2025, 0, 5), y: [6605.86, 6604.76, 6590.73, 6590.75] },
      { x: new Date(2025, 0, 6), y: [6590.75, 6604.76, 6590.73, 6582.10] },
      { x: new Date(2025, 0, 7), y: [6582.10, 6604.76, 6516.73, 6550.10] },
      { x: new Date(2025, 0, 8), y: [6550.10, 6604.76, 6550.73, 6600.23] },
      { x: new Date(2025, 0, 9), y: [6600.23, 6604.76, 6590.73, 6652.89] },
      { x: new Date(2025, 0, 10), y: [6652.89, 6670.00, 6632.89, 6660.89] },
      { x: new Date(2025, 0, 11), y: [6660.89, 6670.00, 6632.89, 6650.89] },
      { x: new Date(2025, 0, 12), y: [6650.89, 6670.00, 6632.89, 6638.89] },
      { x: new Date(2025, 0, 13), y: [6638.89, 6670.00, 6598.89, 6618.89] },
    ]
  }
]