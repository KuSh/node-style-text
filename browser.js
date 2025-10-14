import {factory} from './utilities.js'

const styleText = factory((_formats, value) => value)
export default styleText
export {styleText as stderr, styleText as stdout}
