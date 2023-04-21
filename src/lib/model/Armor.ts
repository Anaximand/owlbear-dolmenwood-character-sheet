import type { Merge } from "../types";
import type { GearInfo } from "./Gear";
import type { Stat } from "./PlayerCharacter";

export type ShieldProperty = "Shield" | "OneHanded" | "TwoHanded";

export type ArmorAC = {
  base: number;
  modifier: number;
  stat?: Stat;
};

export type ArmorInfo = Merge<
  GearInfo,
  {
    type: "Armor";
    ac: ArmorAC;
  }
>;