module.exports = {
  externalEntries: {
    plugins: [
      { removeTitle: true },
      { removeComments: true },
      { convertColors: { shorthex: false } },
      { convertPathData: true },
      { removeXMLProcInst: true },
      { removeEditorsNSData: true },
      { removeUselessDefs: true },
      { collapseGroups: true },
      { removeViewBox: false },
    ],
  },
  inlineEntries: {
    plugins: [
      { removeTitle: true },
      { removeComments: true },
      { convertColors: { shorthex: false } },
      { convertPathData: true },
      { removeXMLProcInst: true },
      { removeEditorsNSData: true },
      { removeUselessDefs: true },
      { removeXMLNS: true },
      { collapseGroups: true },
      { removeStyleElement: true },
      { removeViewBox: false },
    ],
  },
}
