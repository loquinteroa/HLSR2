import AppSettingsService from './AppSettingsService'
import axios from 'axios';

class HLSRSBService {
    constructor(appSettings: AppSettingsService) {
        if (!appSettings) {
            throw new Error('the app settings service was not provided');
        }
        this.appSettings = appSettings;
        axios.defaults.headers.common["Content-Type"] = 'application/json'
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = '*'
        axios.defaults.headers.common["Access-Control-Allow-Methods"] = 'PUT, POST, GET, DELETE, PATCH, OPTIONS'
        axios.defaults.headers.common["Access-Control-Allow-Headers"] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token'
        axios.defaults.headers.common["X-Functions-Key"] = this.appSettings.GetWebApiKey()
    }

    // settings service
    appSettings: AppSettingsService;

    public async getVolunteerShifts(workgroupId: string, accountId: string, startDate: string, endDate: string) {
        const instance = axios.create()
        const url = this.appSettings.GetWebApiBaseUri() + "/volunteer/shifts"
        const data = {"accountid": accountId, "workgroupid": workgroupId, "start_date": startDate, "end_date": endDate}
        try{
            const response = await instance.post(url, data)
            return response.data
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    public async getMemberShifts(workgroupId: string, accountId: string, startDate: string, endDate: string) {
        
    }

    public async getCommitteeMembers(workgroupId: string) {
        const instance = axios.create()
        const url = this.appSettings.GetWebApiBaseUri() + "/committee/data"
        const data = {"committeeid": workgroupId}
        try{
            const response = await instance.post(url, data)
            return response.data
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    //Gets clocked in people
    public async getWhosOn(workgroupId: string) {
        const instance = axios.create()
        const url = this.appSettings.GetWebApiBaseUri() + "/volunteers/onduty/ids"
        const data = {"workgroupId": workgroupId}
        try{
            const response = await instance.post(url, data)
            return response.data
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    
    public async getCommittees() {
        const instance = axios.create()
        const url = this.appSettings.GetWebApiBaseUri() + "/committees"
        const data = {}
        try{
            const response = await instance.post(url, data)
            return response.data
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    public async getCommitteeSetup(mode: string) {
        const instance = axios.create()
        const url = this.appSettings.GetWebApiBaseUri() + "/committee/config"
        const data = {"mode": mode}
        try{
            const response = await instance.post(url, data)
            return response.data
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    //Gets shift data
    public async getShiftList(workgroupId: string, startDate: string, endDate: string) {
        const instance = axios.create()
        const url = this.appSettings.GetWebApiBaseUri() + "/shifts"
        const data = {"workgroupid": workgroupId, "start_date": startDate, "end_date": endDate}
        try{
            const response = await instance.post(url, data)
            return response.data
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

export default HLSRSBService;