import { match } from "ts-pattern"
import { pipe } from "fp-ts/function"
import * as E from "fp-ts/Either"
import { Either } from "fp-ts/Either"
import { Tuple, unsafeParse } from "../../utils/tuple"

export type Rover = Readonly<{ position: Position; direction: Direction }>
export type Position = Readonly<{ x: number; y: number }>
export type Direction = "N" | "E" | "W" | "S"
export type Planet = Readonly<{
  size: Size
  obstacles: ReadonlyArray<Obstacle>
}>
export type Size = Readonly<{ width: number; height: number }>
export type Obstacle = Readonly<{ position: Position }>
export type Command = "TurnRight" | "TurnLeft" | "MoveForward" | "MoveBackward"
export type Commands = ReadonlyArray<Command>
type Delta = Readonly<{ x: number; y: number }>

const planet =
  (size: Size) =>
  (obstacles: ReadonlyArray<Obstacle>): Planet => ({ size, obstacles })

const rover =
  (position: Position) =>
  (direction: Direction): Rover => ({ position, direction })

const position =
  (x: number) =>
  (y: number): Position => ({ x, y })

const size =
  (width: number) =>
  (height: number): Size => ({ width, height })

const obstacle =
  (x: number) =>
  (y: number): Obstacle => ({ position: { x, y } })

type ParseError =
  | InvalidSize
  | InvalidObstacle
  | InvalidPosition
  | InvalidDirection
  | InvalidCommand

type InvalidSize = Readonly<{ _tag: "InvalidSize"; error: Error }>
type InvalidObstacle = Readonly<{ _tag: "InvalidObstacle"; error: Error }>
type InvalidPosition = Readonly<{ _tag: "InvalidPosition"; error: Error }>
type InvalidDirection = Readonly<{ _tag: "InvalidDirection"; error: Error }>
type InvalidCommand = Readonly<{ _tag: "InvalidCommand"; error: Error }>

export const invalidSize = (e: Error): ParseError => ({
  _tag: "InvalidSize",
  error: e,
})
export const invalidObstacle = (e: Error): ParseError => ({
  _tag: "InvalidObstacle",
  error: e,
})
export const invalidPosition = (e: Error): ParseError => ({
  _tag: "InvalidPosition",
  error: e,
})
export const invalidDirection = (e: Error): ParseError => ({
  _tag: "InvalidDirection",
  error: e,
})
export const invalidCommand = (e: Error): ParseError => ({
  _tag: "InvalidCommand",
  error: e,
})

// ENTRY POINT

export const runApp = (
  inputPlanet: Tuple<string, string>,
  inputRover: Tuple<string, string>,
  inputCommands: string,
): Either<ParseError, string> =>
  pipe(
    runMission(inputPlanet, inputRover, inputCommands),
    E.map(renderComplete),
  )

const runMission = (
  inputPlanet: Tuple<string, string>,
  inputRover: Tuple<string, string>,
  inputCommands: string,
): Either<ParseError, Rover> =>
  pipe(
    E.of(executeAll),
    E.ap(parsePlanet(inputPlanet)),
    E.ap(parseRover(inputRover)),
    E.ap(parseCommands(inputCommands)),
  )

// PARSING

export const parseCommands = (
  input: string,
): Either<ParseError, ReadonlyArray<Command>> =>
  E.traverseArray(parseCommand)(input.split(""))

export const parseCommand = (input: string): Either<ParseError, Command> =>
  match(input.toLocaleUpperCase())
    .with("R", () => E.right("TurnRight" as const))
    .with("L", () => E.right("TurnLeft" as const))
    .with("F", () => E.right("MoveForward" as const))
    .with("B", () => E.right("MoveBackward" as const))
    .otherwise(() => E.left(invalidCommand(new Error(`Input: ${input}`))))

export const parseRover = (
  input: Tuple<string, string>,
): Either<ParseError, Rover> =>
  pipe(
    E.of(rover),
    E.ap(parsePosition(input.first)),
    E.ap(parseDirection(input.second)),
  )

export const parsePosition = (input: string): Either<ParseError, Position> =>
  pipe(
    parseTuple(",", input),
    E.mapLeft(invalidPosition),
    E.map((tuple) => position(tuple.first)(tuple.second)),
  )

export const parseDirection = (input: string): Either<ParseError, Direction> =>
  match(input.toLocaleUpperCase())
    .with("N", () => E.right("N" as const))
    .with("E", () => E.right("E" as const))
    .with("W", () => E.right("W" as const))
    .with("S", () => E.right("S" as const))
    .otherwise(() => E.left(invalidDirection(new Error(`Input: ${input}`))))

export const parsePlanet = (
  input: Tuple<string, string>,
): Either<ParseError, Planet> =>
  pipe(
    E.of(planet),
    E.ap(parseSize(input.first)),
    E.ap(parseObstacles(input.second)),
  )

export const parseSize = (input: string): Either<ParseError, Size> =>
  pipe(
    parseTuple("x", input),
    E.mapLeft(invalidSize),
    E.map((tuple) => size(tuple.first)(tuple.second)),
  )

export const parseObstacles = (
  input: string,
): Either<ParseError, ReadonlyArray<Obstacle>> =>
  E.traverseArray(parseObstacle)(input.split(" "))

export const parseObstacle = (input: string): Either<ParseError, Obstacle> =>
  pipe(
    parseTuple(",", input),
    E.mapLeft(invalidObstacle),
    E.map((tuple) => obstacle(tuple.first)(tuple.second)),
  )

const parseTuple = (
  separator: string,
  input: string,
): Either<Error, Tuple<number, number>> =>
  E.tryCatch(() => unsafeParse(separator, input), E.toError)

// RENDERING

const renderComplete = (rover: Rover): string =>
  `${rover.position.x}:${rover.position.y}:${rover.direction}`

// DOMAIN

const executeAll =
  (planet: Planet) =>
  (rover: Rover) =>
  (commands: Commands): Rover =>
    commands.reduce(execute(planet), rover)

const execute =
  (planet: Planet) =>
  (rover: Rover, command: Command): Rover =>
    match(command)
      .with("TurnRight", () => turnRight(rover))
      .with("TurnLeft", () => turnLeft(rover))
      .with("MoveForward", () => moveForward(planet, rover))
      .with("MoveBackward", () => moveBackward(planet, rover))
      .exhaustive()

const turnRight = (rover: Rover): Rover => {
  const direction = match(rover.direction)
    .with("N", () => "E" as const)
    .with("E", () => "S" as const)
    .with("S", () => "W" as const)
    .with("W", () => "N" as const)
    .exhaustive()

  return pipe(rover, updateRover({ direction }))
}

const turnLeft = (rover: Rover): Rover => {
  const direction = match(rover.direction)
    .with("N", () => "W" as const)
    .with("W", () => "S" as const)
    .with("S", () => "E" as const)
    .with("E", () => "N" as const)
    .exhaustive()

  return pipe(rover, updateRover({ direction }))
}

const moveForward = (planet: Planet, rover: Rover): Rover => {
  const newPosition = next(planet, rover, delta(rover.direction))
  return updateRover({ position: newPosition })(rover)
}

const moveBackward = (planet: Planet, rover: Rover): Rover => {
  const newPosition = next(planet, rover, delta(opposite(rover.direction)))
  return updateRover({ position: newPosition })(rover)
}

const opposite = (direction: Direction): Direction =>
  match(direction)
    .with("N", () => "S" as const)
    .with("S", () => "N" as const)
    .with("E", () => "W" as const)
    .with("W", () => "E" as const)
    .exhaustive()

const delta = (direction: Direction): Delta =>
  match(direction)
    .with("N", () => ({ x: 0, y: 1 }))
    .with("S", () => ({ x: 0, y: -1 }))
    .with("E", () => ({ x: 1, y: 0 }))
    .with("W", () => ({ x: -1, y: 0 }))
    .exhaustive()

const next = (planet: Planet, rover: Rover, delta: Delta): Position => {
  const newX = wrap(rover.position.x, planet.size.width, delta.x)
  const newY = wrap(rover.position.y, planet.size.height, delta.y)
  const candidate = position(newX)(newY)
  return updatePosition(candidate)(rover.position)
}

const wrap = (value: number, limit: number, delta: number): number =>
  (((value + delta) % limit) + limit) % limit

const updatePosition =
  (values: Partial<Position>) =>
  (actual: Position): Position => ({
    ...actual,
    ...values,
  })

const updateRover =
  (values: Partial<Rover>) =>
  (actual: Rover): Rover => ({
    ...actual,
    ...values,
  })
