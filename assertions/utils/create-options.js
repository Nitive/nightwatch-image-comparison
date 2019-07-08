const path = require('path')
const { defaultOptions } = require('webdriver-image-comparison/build/helpers/options')
const { getElementsBySelectors } = require('./elements')

function getScreenshotFolder({ testsBasePath, testFileName }) {
  const parts = path.relative(testsBasePath, testFileName).split(path.sep)

  return parts
    .slice(0, -1)
    .concat(parts[parts.length - 1].split('.')[0])
    .join(path.sep)
}

exports.createOptions = async (client, browserName, options = {}) => {
  const { hideSelectors = [], removeSelectors = [], allowedMisMatchPercentage, ...opts } = options

  const testsBasePath = path.join(__dirname, '../../tests/')
  const screenshotFolder = getScreenshotFolder({
    testsBasePath,
    testFileName: client.currentTest.module,
  })

  const wic = defaultOptions({
    autoSaveBaseline: true,
    formatImageName: `${screenshotFolder}/{tag}/${browserName}-{width}x{height}`,
  })

  const method = {
    ...opts,
    hideElements: await getElementsBySelectors(client, hideSelectors),
    removeElements: await getElementsBySelectors(client, removeSelectors),
    returnAllCompareData: true,
  }

  return {
    options: { wic, method },
    allowedMisMatchPercentage,
  }
}
