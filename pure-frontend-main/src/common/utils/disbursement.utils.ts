import {
    DISBURSEMENT_APPROVAL_STATUS,
    DISBURSEMENT_REFUND_STATUS,
} from '@/common/constants/disbursements.constant';

type DisbursementApprovalStatus =
    (typeof DISBURSEMENT_APPROVAL_STATUS)[keyof typeof DISBURSEMENT_APPROVAL_STATUS];
type DisbursementRefundStatus =
    (typeof DISBURSEMENT_REFUND_STATUS)[keyof typeof DISBURSEMENT_REFUND_STATUS];
export type StatusType = DisbursementApprovalStatus | DisbursementRefundStatus;

const statusColors: Record<StatusType, string> = {
    APPROVED: 'bg-green-100 text-green-800',
    REFUNDED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-600 text-white',
    INITIATED: 'bg-blue-100 text-blue-800',
    RE_INITIATED: 'bg-blue-200 text-blue-900',
    PROCESSING: 'bg-yellow-100 text-yellow-800',
};

export const getStatusColor = (status: StatusType): string => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
};
