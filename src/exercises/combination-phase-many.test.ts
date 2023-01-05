import { pipe } from "fp-ts/function"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"

// TODO  1: for each test, remove the skip marker and make it green
describe("combination phase - many", () => {
  type Item = {
    name: string
    qty: number
  }

  const itemCtor =
    (name: string) =>
    (qty: number): Item => ({ name, qty })

  const checkName = (value: string): Option<string> =>
    value ? O.some(value) : O.none

  const checkQty = (value: string): Option<number> =>
    value.match(/^[0-9]+$/i) ? O.some(Number(value)) : O.none

  // TODO  2: create an item only if name and quantity are valid
  const createItem = (name: string, qty: string): Option<Item> => {
    throw new Error("TODO")
  }

  test.skip("creation with valid parameters", () => {
    const result = createItem("foo", "100")

    expect(result).toStrictEqual(O.some({ name: "foo", qty: 100 }))
  })

  test.skip("creation with invalid name", () => {
    const result = createItem("", "100")

    expect(result).toStrictEqual(O.none)
  })

  test.skip("creation with invalid quantity", () => {
    const result = createItem("foo", "")

    expect(result).toStrictEqual(O.none)
  })
})
