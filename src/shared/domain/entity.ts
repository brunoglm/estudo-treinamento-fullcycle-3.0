import { ValueObject } from "./value-object";

export abstract class Entity {
  abstract get id(): ValueObject<any>;
  abstract toJSON(): any;
}
