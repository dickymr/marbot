import httpStatus from 'http-status';
import config from '../config';
import { getSubscribers as getRealSubscribers, sendMessage } from '../services';
import { deleteSubscriber, getSubscribers as getDBSubscribers } from '../services/subscriber.service';


export const syncSubscribers = async () => {
    const realSubscribers = await getRealSubscribers();
    const dbSubscribers = await getDBSubscribers();
    const deletedSubcribers: string[] = [];

    dbSubscribers.forEach(async (subscriber) =>  {
        if (realSubscribers.find((subscriberId: string) => subscriberId === subscriber.id)) return;
        deletedSubcribers.push(subscriber.id)
        await deleteSubscriber(subscriber.id)  
    });

    await sendMessage({
        senderId: config.groupFeedbackId,
        content: `Deleted ${deletedSubcribers.length} subscribers ${JSON.stringify(deletedSubcribers)}`,
        type: 'group',
    });
    
    return {
        status: httpStatus.OK,
        response: { deletedSubcribers },
    };
};
