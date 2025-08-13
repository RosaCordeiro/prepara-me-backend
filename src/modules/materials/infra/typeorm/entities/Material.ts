import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("material")
class Material {
    @PrimaryColumn()
    id: string;

    @Column()
    slug?: string;

    @Column()
    title?: string;

    @Column()
    backgroundColor?: string;

    @Column()
    buttonColor?: string;

    @Column()
    file?: string;

    @Column()
    image?: string;

    @Column()
    link?: string;

    @CreateDateColumn()
    created_at: Date;

    constructor(
        title?: string,
        backgroundColor?: string,
        buttonColor?: string,
        slug?: string,
        file?: string,
        id?: string,
        image?: string,
        link?: string,
    ) {
        this.title = title;
        this.backgroundColor = backgroundColor;
        this.buttonColor = buttonColor;
        this.file = file;
        this.slug = slug;
        this.image = image;
        this.link = link;

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
