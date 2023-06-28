import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("click_names")
class ClickNames {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    constructor(id: string, name: string) {
        if (id) {
            this.id = id;
        }

        if (!this.id) {
            this.id = uuidV4();
        }

        this.name = name;
    }
}

export { ClickNames };

