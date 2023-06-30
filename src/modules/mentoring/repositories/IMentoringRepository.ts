import { ICreateMentoringDTO } from "../dtos/ICreateMentoring";
import { Mentoring } from "../infra/typeorm/entities/Mentoring";

interface IMentoringRepository {
    create(data: ICreateMentoringDTO): Promise<Mentoring>;
    find(): Promise<Mentoring[]>;
    delete(id: string): Promise<void>;
    update(id: string, data: ICreateMentoringDTO): Promise<Mentoring>;
    findById(id: string): Promise<Mentoring>;
}

export { IMentoringRepository };

