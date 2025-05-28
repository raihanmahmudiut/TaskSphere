import React, { useState } from 'react';
import { useSWRConfig } from 'swr';

import { useToast } from '@/components/ui/use-toast';
import {
    approveAndCompleteDisbursement,
    approveDisbursement,
    convertManualRefundToSystematic,
    convertSystematicRefundToManual,
    initiateDisbursement,
    markManualRefundAsFailed,
    markManualRefundAsSucceeded,
    reInitateDisbursement,
    rejectDisbursement,
    requeueSystematicRefund,
    retrySystematicRefund,
} from '@/modules/finance/finance-refund/finance-refund.service';
import { DisbursementCardProps } from '@/modules/finance/finance-refund/finance-refund.types';

export const useDisbursementActions = ({
    disbursement,
}: DisbursementCardProps) => {
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [markFailedReason, setMarkFailedReason] = useState('');
    const [mfsTransactionId, setMfsTransactionId] = useState('');
    const { toast } = useToast();

    const handleMutate = async () => {
        await mutate(
            (key) =>
                typeof key === 'string' &&
                key.startsWith('financeDisbursementList'),
            undefined,
            { revalidate: true }
        );
    };

    //Dialog States

    const [isApproveDialogOpen, setIsApproveDialogOpen] = React.useState(false);
    const [isApproveAndCompleteDialogOpen, setIsApproveAndCompleteDialogOpen] =
        React.useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);
    const [isInitiateDialogOpen, setIsInitiateDialogOpen] =
        React.useState(false);
    const [isReInitiateDialogOpen, setIsReInitiateDialogOpen] =
        React.useState(false);
    const [isReQueueDialogOpen, setIsReQueueDialogOpen] = React.useState(false);
    const [isMarkFailedDialogOpen, setIsMarkFailedDialogOpen] =
        React.useState(false);
    const [isMarkSucceededDialogOpen, setIsMarkSucceededDialogOpen] =
        React.useState(false);
    const [
        isConvertToSystematicDialogOpen,
        setIsConvertToSystematicDialogOpen,
    ] = React.useState(false);
    const [isConvertToManualDialogOpen, setIsConvertToManualDialogOpen] =
        React.useState(false);
    const [isRetrySystematicDialogOpen, setIsRetrySystematicDialogOpen] =
        React.useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const result = await approveDisbursement(disbursement.id);
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description: 'Disbursement approved successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to approve disbursement:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to approve disbursement.',
            });
        } finally {
            setIsLoading(false);
            setIsApproveDialogOpen(false);
        }
    };

    const handleApproveAndComplete = async () => {
        setIsLoading(true);
        try {
            const result = await approveAndCompleteDisbursement(
                disbursement.id,
                {
                    mfs_transaction_id: mfsTransactionId,
                }
            );
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description:
                        'Disbursement approved and completed successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error(
                'Failed to approve and complete disbursement:',
                error
            );
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to approve and complete disbursement.',
            });
        } finally {
            setIsLoading(false);
            setIsApproveAndCompleteDialogOpen(false);
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        try {
            const result = await rejectDisbursement(disbursement.id, {
                reason: rejectReason,
            });
            if (result.success) {
                setRejectReason('');
                await handleMutate();
                toast({
                    title: 'Success',
                    description: 'Disbursement rejected successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to reject disbursement:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to reject disbursement.',
            });
        } finally {
            setIsLoading(false);
            setIsRejectDialogOpen(false);
        }
    };

    const handleInitiate = async () => {
        setIsLoading(true);
        try {
            const result = await initiateDisbursement(disbursement.id);
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description: 'Disbursement initiated successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to initiate disbursement:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to initiate disbursement.',
            });
        } finally {
            setIsLoading(false);
            setIsInitiateDialogOpen(false);
        }
    };

    const handleReInitiate = async () => {
        setIsLoading(true);
        try {
            const result = await reInitateDisbursement(disbursement.id);
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description: 'Disbursement re-initiated successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to re-initiate disbursement:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to re-initiate disbursement.',
            });
        } finally {
            setIsLoading(false);
            setIsReInitiateDialogOpen(false);
        }
    };

    const handleMarkFailed = async () => {
        setIsLoading(true);
        try {
            const result = await markManualRefundAsFailed(disbursement.id, {
                reason: markFailedReason,
            });
            if (result.success) {
                setMarkFailedReason('');
                await handleMutate();
                toast({
                    title: 'Success',
                    description: 'Manual refund marked as failed successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to mark refund as failed:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to mark refund as failed.',
            });
        } finally {
            setIsLoading(false);
            setIsMarkFailedDialogOpen(false);
        }
    };

    const handleMarkSucceeded = async () => {
        setIsLoading(true);
        try {
            const result = await markManualRefundAsSucceeded(disbursement.id, {
                mfs_transaction_id: mfsTransactionId,
            });
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description:
                        'Manual refund marked as succeeded successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to mark refund as succeeded:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to mark refund as succeeded.',
            });
        } finally {
            setIsLoading(false);
            setIsMarkSucceededDialogOpen(false);
        }
    };

    const handleConvertToSystematic = async () => {
        setIsLoading(true);
        try {
            const result = await convertManualRefundToSystematic(
                disbursement.id
            );
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description:
                        'Manual refund converted to systematic successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to convert to systematic refund:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to convert to systematic refund.',
            });
        } finally {
            setIsLoading(false);
            setIsConvertToSystematicDialogOpen(false);
        }
    };

    const handleConvertToManual = async () => {
        setIsLoading(true);
        try {
            const result = await convertSystematicRefundToManual(
                disbursement.id
            );
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description:
                        'Systematic refund converted to manual successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to convert to manual refund:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to convert to manual refund.',
            });
        } finally {
            setIsLoading(false);
            setIsConvertToManualDialogOpen(false);
        }
    };

    const handleRetrySystematic = async () => {
        setIsLoading(true);
        try {
            const result = await retrySystematicRefund(disbursement.id);
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description: 'Systematic refund retried successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to retry systematic refund:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to retry systematic refund.',
            });
        } finally {
            setIsLoading(false);
            setIsRetrySystematicDialogOpen(false);
        }
    };
    const handleRequeueSystematic = async () => {
        setIsLoading(true);
        try {
            const result = await requeueSystematicRefund(disbursement.id);
            if (result.success) {
                await handleMutate();
                toast({
                    title: 'Success',
                    description: 'Systematic refund requeued successfully.',
                });
            } else {
                throw new Error(result.errorMessage);
            }
        } catch (error) {
            console.error('Failed to requeue systematic refund:', error);
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Failed to requeue systematic refund.',
            });
        } finally {
            setIsLoading(false);
            setIsReQueueDialogOpen(false);
        }
    };

    return {
        isLoading,
        rejectReason,
        setRejectReason,
        markFailedReason,
        setMarkFailedReason,
        mfsTransactionId,
        setMfsTransactionId,
        isApproveDialogOpen,
        setIsApproveDialogOpen,
        isRejectDialogOpen,
        setIsRejectDialogOpen,
        isApproveAndCompleteDialogOpen,
        setIsApproveAndCompleteDialogOpen,
        isInitiateDialogOpen,
        setIsInitiateDialogOpen,
        isReInitiateDialogOpen,
        setIsReInitiateDialogOpen,
        isReQueueDialogOpen,
        setIsReQueueDialogOpen,
        isMarkFailedDialogOpen,
        setIsMarkFailedDialogOpen,
        isMarkSucceededDialogOpen,
        setIsMarkSucceededDialogOpen,
        isConvertToSystematicDialogOpen,
        setIsConvertToSystematicDialogOpen,
        isConvertToManualDialogOpen,
        setIsConvertToManualDialogOpen,
        isRetrySystematicDialogOpen,
        setIsRetrySystematicDialogOpen,
        handleApprove,
        handleApproveAndComplete,
        handleReject,
        handleInitiate,
        handleReInitiate,
        handleMarkFailed,
        handleMarkSucceeded,
        handleConvertToSystematic,
        handleConvertToManual,
        handleRetrySystematic,
        handleRequeueSystematic,
    };
};
