import process from 'node:process'
import {styleText} from 'node:util'
import {factory} from './utilities.js'

const stdout = factory(styleText, {stream: process.stdout})
const stderr = factory(styleText, {stream: process.stderr})
export default stdout
export {stderr, stdout}
