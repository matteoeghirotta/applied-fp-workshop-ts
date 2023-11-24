import {
  execute,
  executeAll,
  planet,
  size,
  rover,
  position,
} from "../src/version1"

// TODO 1: gradually eliminate the "skip marker" and check that the test is green
describe("version 1", () => {
  // Planet layout
  // +-----+-----+-----+-----+-----+
  // | 0,3 |     |     |     | 4,3 |
  // +-----+-----+-----+-----+-----+
  // |     |     |     |     |     |
  // +-----+-----+-----+-----+-----+
  // |     |     |     |     |     |
  // +-----+-----+-----+-----+-----+
  // | 0,0 |     |     |     | 4,0 |
  // +-----+-----+-----+-----+-----+

  // NOTE: each test describe the scenario in pseudo-code

  test("turn right command", () => {
    const p = planet(size(5, 4))
    const r = rover(position(0, 0), "N")
    const c = "R"

    const result = execute(p)(r, c)
    expect(result).toStrictEqual(rover(position(0, 0), "E"))
  })

  test("turn left command", () => {
    const p = planet(size(5, 4))
    const r = rover(position(0, 0), "N")
    const c = "L"

    const result = execute(p)(r, c)
    expect(result).toStrictEqual(rover(position(0, 0), "W"))
    //    planet = Planet: 5 4 (no obstacles)
    //    rover = Rover: 0 0 N
    //    command = Command: L
    //    result = execute(planet, rover, command)
    //    assertEquals(result, Rover: 0 0 W)
  })

  test("move forward command", () => {
    const p = planet(size(5, 4))
    const r = rover(position(0, 1), "N")
    const c = "F"

    const result = execute(p)(r, c)
    expect(result).toStrictEqual(rover(position(0, 2), "N"))
    //    planet = Planet: 5 4 (no obstacles)
    //    rover = Rover: 0 1 N
    //    command = Command: F
    //    result = execute(planet, rover, command)
    //    expect(result).toBe(Rover: 0 2 N)
  })

  test("move forward command, opposite direction", () => {
    const p = planet(size(5, 4))
    const r = rover(position(0, 1), "S")
    const c = "F"

    const result = execute(p)(r, c)
    expect(result).toStrictEqual(rover(position(0, 0), "S"))
    //    planet = Planet: 5 4 (no obstacles)
    //    rover = Rover: 0 1 S
    //    command = Command: F
    //    result = execute(planet, rover, command)
    //    expect(result).toBe(Rover: 0 0 S)
  })

  test("move backward command", () => {
    const p = planet(size(5, 4))
    const r = rover(position(0, 1), "N")
    const c = "B"

    const result = execute(p)(r, c)
    expect(result).toStrictEqual(rover(position(0, 0), "N"))
    //    planet = Planet: 5 4 (no obstacles)
    //    rover = Rover: 0 1 N
    //    command = Command: B
    //    result = execute(planet, rover, command)
    //    expect(result).toBe(Rover: 0 0 N)
  })

  test("move forward command, opposite direction", () => {
    const p = planet(size(5, 4))
    const r = rover(position(0, 1), "S")
    const c = "B"

    const result = execute(p)(r, c)
    expect(result).toStrictEqual(rover(position(0, 2), "S"))
    //    planet = Planet: 5 4 (no obstacles)
    //    rover = Rover: 0 1 S
    //    command = Command: B
    //    result = execute(planet, rover, command)
    //    expect(result).toBe(Rover: 0 2 S)
  })

  test("wrap on North", () => {
    const p = planet(size(5, 4))
    const r = rover(position(0, 3), "N")
    const c = "F"

    const result = execute(p)(r, c)
    expect(result).toStrictEqual(rover(position(0, 0), "N"))
    //    planet = Planet: 5 4 (no obstacles)
    //    rover = Rover: 0 3 N
    //    command = Command: F
    //    result = execute(planet, rover, command)
    //    expect(result).toBe(Rover: 0 0 N)
  })

  test.skip("go to opposite angle", () => {
    //    planet = Planet 5 4 (no obstacles)
    //    rover = Rover: 0 0 N
    //    commands = Commands: L F R B
    //    result = executeAll(planet, rover, commands)
    //    expect(result).toBe(Rover: 4 3 N)
  })
})
