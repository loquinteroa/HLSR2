export interface Shift{
    id: string;
    memberId: string;
    memberName: string;
    memberPhone: string;
    onDuty: boolean;
    roleId: string;
    roleName: string;
    title: string;
    startDate: string;
    startTime: string;
    startDateSorting: string;
    endDate: string;
    endTime: string;
    startDateTime?: Date;
    endDateTime?: Date;
}
