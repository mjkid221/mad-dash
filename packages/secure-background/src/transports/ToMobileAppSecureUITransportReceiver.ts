import {
  CHANNEL_SECURE_UI_REQUEST,
  CHANNEL_SECURE_UI_RESPONSE,
  getLogger,
  postMessageFromAppToHiddenBackgroundWebView,
} from "@coral-xyz/common";
import EventEmitter from "eventemitter3";

import type {
  SECURE_EVENTS,
  SecureRequest,
  SecureRequestType,
  TransportHandler,
  TransportReceiver,
} from "../../types";
import { TransportResponder } from "../transports/TransportResponder";

export const MOBILE_APP_SECUREUI_RECEIVER_EVENTS = new EventEmitter();

const logger = getLogger("secure-ui ToMobileAppSecureUITransportReceiver");

export class ToMobileAppSecureUITransportReceiver<
  T extends SECURE_EVENTS = SECURE_EVENTS,
  R extends SecureRequestType = undefined
> implements TransportReceiver<T, R>
{
  public setHandler = (handler: TransportHandler<T, R>) => {
    const listener = async (message: {
      channel: string;
      data: SecureRequest<T, R>;
    }) => {
      if (message.channel !== CHANNEL_SECURE_UI_REQUEST) {
        return;
      }

      new TransportResponder<T, R>({
        request: message.data,
        handler,
        onResponse: (response) => {
          try {
            postMessageFromAppToHiddenBackgroundWebView({
              channel: CHANNEL_SECURE_UI_RESPONSE,
              data: response,
            });
          } catch (err) {
            logger.error(String(err));
          }
        },
      });
    };
    MOBILE_APP_SECUREUI_RECEIVER_EVENTS.on("message", listener);

    return () => {
      MOBILE_APP_SECUREUI_RECEIVER_EVENTS.off("message", listener);
    };
  };
}
