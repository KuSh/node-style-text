import {factory} from './utilities.js'

// eslint-disable-next-line unicorn/no-useless-undefined
const styleText = factory((_formats, value) => value, undefined)
export default styleText
export {styleText as stderr, styleText as stdout}
