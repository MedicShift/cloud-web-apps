import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm"
import { User } from "../entities/user.entity"
import { RemoveEvent } from "typeorm/browser"

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User
    }

    async afterInsert(event: InsertEvent<User>) {
        if (event.entity.tenant) {
            const tenantRepo = event.manager.getRepository("Tenant")
            await tenantRepo.increment(
                { id: event.entity.tenant.id },
                "userCount",
                1
            )
        }
    }

    async afterRemove(event: RemoveEvent<User>) {
        if (event.entity && event.entity.tenant) {
            const tenantRepo = event.manager.getRepository("Tenant")
            await tenantRepo.decrement(
                { id: event.entity.tenant.id },
                "userCount",
                1
            )
        }
    }

}