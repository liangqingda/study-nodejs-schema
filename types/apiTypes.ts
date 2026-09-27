/* eslint-disable check-file/filename-naming-convention, quotes */
// start of generated types
export type GreetingRequest = {
    name: string;
    mood?: GreetingMood;
};

export type GreetingMood = "friendly" | "formal";

export type GreetingResponsePayload = {
    message: string;
};
