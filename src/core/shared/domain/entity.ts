import { Notification } from "./validators/notification";
import { ValueObject } from "./value-object";

export abstract class Entity {
  notification: Notification = new Notification();
  abstract get id(): ValueObject<any>;
  abstract toJSON(): any;
}
