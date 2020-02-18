
const iniailState = {
    User_ID: '',
    Email: '',
    Name: '',
    Last_name: '',
    Nickname: '',
    Sex: '',
    Phone_number: '',
    Line_ID: '',
    Facebook: '',
    Birthday: '',
    Position: '',
    Department: '',
    Province_ID: '',
    District_ID: '',
    Tumbon_ID: '',
    Avatar_URL: '',
    Add_date: '',
    Area_ID: '',
    Role: '',
    User_type_ID: '',
}

const User_reducer = (state = iniailState, action) => {
    switch (action.type) {
        case 'SetUser':
            state = {
                ...action.state
            }
            break;

        default:
            break;
    }
    return state;
}
export default User_reducer;