import { Owner } from "../../types/owner";
import { Role } from "../../types/role";
import { Shift } from "../../types/shift";
import { Account } from "../../types/account";
import { Workgroup } from "../../types/workgroup";
import { Buffer } from "buffer";
import moment from "moment";

// ─── Current-user reactive variable (lightweight replacement for Apollo makeVar) ──
let _currentUser: Owner = { id: "", email: "", name: "" };

export function getCurrentUser(): Owner {
  return _currentUser;
}

export function setCurrentUser(user: Owner): void {
  _currentUser = user;
}

// ─── URL helpers ─────────────────────────────────────────────────────────────
export const domain = process.env.REACT_APP_ROUTING_PATH;

export const addHttpsToFullUrl = (url: string): string => {
  const findHttp = new RegExp("https?://");
  return findHttp.test(url) ? url : `https://${url}`;
};

export const validateShortUrl = (url: string): boolean => {
  const shortUrlValidation = new RegExp("^[a-zA-Z0-9\\s/]*$");
  return shortUrlValidation.test(url);
};

export const validateLongUrl = (url: string): boolean => {
  const fullUrlValidation = new RegExp(
    "(https?://)([\\.da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?",
  );
  return fullUrlValidation.test(url);
};

export const containString = (search: string, substring: string): boolean => {
  if (!search) return false;
  return (
    search.toString().toLowerCase().indexOf(substring.toString().toLowerCase()) >= 0
  );
};

// ─── Owner / link helpers ────────────────────────────────────────────────────
export const ownersArrayToString = (owners: Owner[]): string => {
  let ownerString = "";
  owners.map(function (owner: Owner, index: number) {
    ownerString += (owner && index ? "; " : "") + (owner?.name ?? "");
    return owner;
  });
  ownerString =
    ownerString.indexOf("; ") === 0
      ? ownerString.replace(";", "")
      : ownerString;
  return ownerString;
};

export const dateFormat = (isoDate: Date | undefined): string => {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString();
};

// ─── Account / workgroup / shift converters ─────────────────────────────────
export function convertToAccountsArray(
  accountsJson: Array<any>,
): Array<Account> {
  const accounts: Array<Account> = [];
  accountsJson.forEach((elem) => {
    accounts.push({
      id: elem.id,
      firstName: elem.first_name,
      lastName: elem.last_name,
      screenName: elem.screen_name,
      phone: elem.mobile_phone ? formatPhoneNumber(elem.mobile_phone) : "",
      email: elem.email ? elem.email : "",
      title: elem.title ? elem.title : "",
    });
  });
  return accounts.sort((a, b) => (a.firstName < b.firstName ? -1 : 1));
}

export function convertToWorkgroupArray(
  workgroupJson: Array<any>,
): Array<Workgroup> {
  const workgroups: Array<Workgroup> = [];
  workgroupJson.forEach((elem) => {
    workgroups.push({
      id: elem.id,
      name: elem.name,
    });
  });
  return workgroups.sort((a, b) => (a.name < b.name ? -1 : 1));
}

export function convertToShiftsArray(
  shiftsJson: Array<any>,
  accounts: Array<Account>,
  roles: Array<Role>,
  onDuty: Array<Account>,
): Array<Shift> {
  const shifts: Array<Shift> = [];
  shiftsJson.forEach((elem) => {
    if (elem.covering_member) {
      const account: Account = getAccountById(elem.covering_member, accounts);
      shifts.push({
        memberId: elem.covering_member,
        memberName: account.screenName,
        memberPhone: account.phone,
        onDuty: isMemberOnDuty(
          elem.covering_member,
          onDuty,
          elem.start_date.substring(0, 10),
        ),
        id: elem.id,
        roleId: elem.role,
        roleName: getRoleNameById(elem.role, roles),
        startDate: formatDate(elem.start_date, false),
        startDateSorting: formatDate(elem.start_date, true),
        startTime: formatTime(elem.start_date),
        endDate: formatDate(elem.end_date, false),
        endTime: formatTime(elem.end_date),
        title: elem.title ? elem.title : ""
      });
    }
  });
  return shifts.sort((a, b) =>
    a.startDateSorting + a.memberName < b.startDateSorting + b.memberName
      ? -1
      : 1,
  );
}

export function convertToRolesArray(rolesJson: Array<any>): Array<Role> {
  const roles: Array<Role> = [];
  if (rolesJson && rolesJson.length > 0) {
    rolesJson.forEach((elem) => {
      roles.push({
        id: elem.id,
        name: elem.name,
      });
    });
  }
  return roles.sort((a, b) => (a.name < b.name ? -1 : 1));
}

export function getRoles(rolesJson: Array<any>): Array<Role> {
  const roles: Array<Role> = [];
  rolesJson.forEach((elem) => {
    roles.push({
      id: elem.role,
      name: elem.name,
    });
  });
  return roles;
}

export function getRoleNameById(
  roleId: string,
  roles: Array<Role>,
): string {
  if (roles !== undefined && roles !== null) {
    const roleName = roles.find((a) => a.id === roleId)?.name;
    if (roleName !== undefined) return roleName;
  }
  return "";
}

export function isMemberOnDuty(
  accountId: string,
  onDuty: Array<Account>,
  shiftDate: string,
): boolean {
  if (onDuty && onDuty.length > 0 && isAPIDateToday(shiftDate)) {
    const found = onDuty.find((a) => a.id === accountId);
    return found !== undefined && found !== null;
  }
  return false;
}

export function isOnDuty(
  accountId: string,
  onDuty: Array<Account>,
): boolean {
  const found = onDuty.find((a) => a.id === accountId);
  return found !== undefined && found !== null;
}

export function getAccountById(
  accountId: string,
  accts: Array<Account>,
): Account {
  const emptyAcct: Account = {
    id: "",
    title: "",
    firstName: "",
    lastName: "",
    screenName: "",
    phone: "",
    email: "",
  };
  const found = accts.find((a) => a.id === accountId);
  return found !== undefined ? found : emptyAcct;
}

// ─── Formatting helpers ─────────────────────────────────────────────────────
export function formatPhoneNumber(phoneNumberString: string): string {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return "";
}

export function formatDate(strDate: string, isSorting: boolean): string {
  if (strDate && strDate !== "") {
    return isSorting
      ? moment(strDate).format("YYYY-MM-DDTHH:mm")
      : moment(strDate).format("MM/DD/YYYY");
  }
  return "";
}

export function formatTitle(workgroupName: string, strDate: string): string {
  if (strDate && strDate !== "") {
    return workgroupName + " Roster - " + moment(strDate).format("dddd, MMM Do YYYY");
  }
  return "";
}

export function formatTime(strDate: string): string {
  if (strDate && strDate !== "") {
    const dtDate = Date.parse(strDate);
    return moment(dtDate).format("hh:mm A");
  }
  return "";
}

export function formatAPIDate(strDate: string): string {
  if (strDate && strDate !== "") {
    return (
      strDate.substring(5, 7) +
      "/" +
      strDate.substring(8, 10) +
      "/" +
      strDate.substring(0, 4)
    );
  }
  return "";
}

export function getAPIDate(shiftDate: any): string {
  if (shiftDate && shiftDate instanceof Date) {
    return moment(shiftDate).format("YYYY-MM-DD");
  }
  return "";
}

export function getAPIDateFromString(shiftDate: string): string {
  if (shiftDate) {
    const dtDate = Date.parse(shiftDate);
    return moment(dtDate).format("YYYY-MM-DD");
  }
  return "";
}

export function getFormatedDate(dtDate: Date, format: string): string {
  if (dtDate && dtDate instanceof Date) {
    return moment(dtDate).format(format);
  }
  return "";
}

export function isAPIDateToday(strDate: string): boolean {
  if (strDate && strDate !== "") {
    return strDate === moment(moment.now()).format("YYYY-MM-DD");
  }
  return false;
}

// ─── Role helpers ────────────────────────────────────────────────────────────
export function getAppRoleName(appRole: any): string {
  if (appRole === "SystemAdmin") return "System Admin";
  if (appRole === "CommitteeAdmin") return "Committee Admin";
  return "User";
}

// ─── Encoding helpers ───────────────────────────────────────────────────────
export function btoa_ext(str: any): string {
  let buffer: Buffer;
  if (str instanceof Buffer) {
    buffer = str;
  } else {
    buffer = Buffer.from(str.toString(), "binary");
  }
  return buffer.toString("base64");
}

export function encode(str: string): string {
  return Buffer.from(str, "binary").toString("base64");
}
