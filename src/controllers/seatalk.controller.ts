// @ts-nocheck
import httpStatus from "http-status";
import { handlers } from "../handlers";
import { syncSubscribers } from "../handlers/sync-db";
import apiError from "../utils/apiError";
import catchAsync from "../utils/catchAsync";

const callback = catchAsync(async (req, res) => {
  const { event_type, event } = req.body;

  if (event_type in handlers) {
    const { status, response } = await handlers[event_type](event);
    res.status(status).send(response);
    return;
  }

  throw new apiError(httpStatus.NOT_FOUND, "Event type not found");
});

const syncDB = catchAsync(async (req, res) => {
  const { status, response } = await syncSubscribers();
  res.status(status).send(response);
});

export default { callback, syncDB };
