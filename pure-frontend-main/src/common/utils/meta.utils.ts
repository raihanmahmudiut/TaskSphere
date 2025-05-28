export async function getDeviceInfo() {
    const result = {
        country_code: 'BD',
        country_name: 'Bangladesh',
        city: 'Dhaka',
        postal: '1000',
        latitude: 23.729,
        longitude: 90.4112,
        IPv4: '198.188.191.116',
        state: 'Dhaka',
    };

    return result;
}

export async function makeRequestMeta() {
    const deviceInformation = await getDeviceInfo();

    return { device_info: JSON.stringify(deviceInformation) };
}
