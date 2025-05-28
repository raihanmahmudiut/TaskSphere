import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const dayjsExt = dayjs;

dayjsExt.extend(utc);
dayjsExt.extend(customParseFormat);
dayjsExt.extend(timezone);
dayjsExt.extend(advancedFormat);

export default dayjsExt;
