import { Shift } from "./shift";
import { Account } from "./account";
import { Role } from "./role";

export interface ShiftList{
    workgroupId: string;
    workgroupName: string;
    shiftTitle: string;
    startDate: string;
    endDate: string;
    shifts?: Array<Shift>;
}
