import "@testing-library/jest-dom/extend-expect"
import { TextEncoder, TextDecoder } from "util"

// Fix для `next/jest` при работе с `FormData`
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
