import type {Scale, ScaleShape} from "./scale";
import type {Tuning} from "./tuning";

export type TestUserDataResponse = {
    scales: Scale[],
    tunings: Tuning[],
    shapes: ScaleShape[]
}

export type TuningResponse = {
    tuning: Tuning
}
