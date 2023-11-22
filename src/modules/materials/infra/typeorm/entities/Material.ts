import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("material")
class Material {
    @PrimaryColumn()
    id: string;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column()
    backgroundColor: string;

    @Column()
    file: string;

    @CreateDateColumn()
    created_at: Date;

    constructor(
        title: string,
        backgroundColor: string,
        file: string,
        slug: string,
        id?: string
    ) {
        this.title = title;
        this.backgroundColor = backgroundColor;
        this.file = file;
        this.slug = slug;

        if (!this.id || this.id === "") {
            this.id = uuidV4();
        } else {
            this.id = id;
        }

        if (!this.created_at) {
            this.created_at = new Date();
        }
    }
}

export { Material };
