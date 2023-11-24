/*
    ## V1 - Focus on the center (pure domain logic)

    Develop an API (types and functions) that executes commands:
    - Implement all commands logic.
    - Commands are sent in batch and executed sequentially.
    - The planet grid has a wrapping effect from one edge to another (pacman).
    - For now, ignore obstacle detection logic
 */

import { match } from "ts-pattern"

// TODO 1: Those type alias are only placeholders,
//  use correct type definitions and feel free to add more...
export type Rover = { position: Position; orientation: Direction }
export type Position = { x: number; y: number }
export type Direction = "N" | "S" | "E" | "W"
export type Planet = { size: Size; obstacles: ReadonlyArray<Obstacle> }
export type Size = { width: number; height: number }
export type Obstacle = Position
export type Command = "F" | "B" | "L" | "R"
export type Commands = ReadonlyArray<Command>

export const rover = (position: Position, orientation: Direction) => ({
  position,
  orientation,
})

export const position = (x: number, y: number) => ({ x, y })

export const planet = (size: Size) => ({ size, obstacles: [] })

export const size = (width: number, height: number) => ({ width, height })

// TODO 2: Execute all commands and return final rover state
export const executeAll = (
  planet: Planet,
  rover: Rover,
  commands: Commands,
): Rover => {
  throw new Error("TODO")
}

// TODO 3: Dispatch each command to the specific function
export const execute =
  (planet: Planet) =>
  (r: Rover, command: Command): Rover => {
    return match(command)
      .with("F", () => moveForward(planet, r))
      .with("B", () => moveBackward(planet, r))
      .with("L", () => turnLeft(r))
      .with("R", () => turnRight(r))
      .exhaustive()
  }

// TODO 4: Change rover direction
const turnRight = (r: Rover): Rover => {
  return match(r.orientation)
    .with("N", () => rover(r.position, "E"))
    .with("E", () => rover(r.position, "S"))
    .with("S", () => rover(r.position, "W"))
    .with("W", () => rover(r.position, "N"))
    .exhaustive()
}

// TODO 5: Change rover direction
const turnLeft = (r: Rover): Rover => {
  return match(r.orientation)
    .with("N", () => rover(r.position, "W"))
    .with("E", () => rover(r.position, "N"))
    .with("S", () => rover(r.position, "E"))
    .with("W", () => rover(r.position, "S"))
    .exhaustive()
}

// TODO 6: Change rover position
const moveForward = (planet: Planet, r: Rover): Rover => {
  return match(r.orientation)
    .with("N", () => rover(position(r.position.x, r.position.y + 1), "N"))
    .with("E", () => rover(position(r.position.x + 1, r.position.y), "E"))
    .with("S", () => rover(position(r.position.x, r.position.y - 1), "S"))
    .with("W", () => rover(position(r.position.x - 1, r.position.y), "W"))
    .exhaustive()
}

// TODO 7: Change rover position
const moveBackward = (planet: Planet, r: Rover): Rover => {
  return match(r.orientation)
    .with("N", () => rover(position(r.position.x, r.position.y - 1), "N"))
    .with("E", () => rover(position(r.position.x - 1, r.position.y), "E"))
    .with("S", () => rover(position(r.position.x, r.position.y + 1), "S"))
    .with("W", () => rover(position(r.position.x + 1, r.position.y), "W"))
    .exhaustive()
}

// NOTE: utility function for the pacman effect
const wrap = (value: number, limit: number, delta: number): number =>
  (((value + delta) % limit) + limit) % limit
