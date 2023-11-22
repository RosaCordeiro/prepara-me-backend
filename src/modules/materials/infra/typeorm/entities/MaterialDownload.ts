import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Material } from "./Material";

@Entity("material_download")
class MaterialDownload {
    @PrimaryColumn()
    id: string;

    @Column()
    material_id: string;

    @ManyToOne(() => Material)
    @JoinColumn({ name: "material_id" })
    clickName: Material;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    company?: string;

    @Column()
    position?: string;

    @CreateDateColumn()
    created_at: Date;

    constructor(
        name: string,
        email: string,
        phone: string,
        material_id: string,
        company?: string,
        position?: string,
        id?: string
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.material_id = material_id;
        this.company = company;
        this.position = position;

        if (!this.id) {
            this.id = uuidV4();
        }

        if (!this.created_at) {
            this.created_at = new Date();
        }
    }
}

export { MaterialDownload };
