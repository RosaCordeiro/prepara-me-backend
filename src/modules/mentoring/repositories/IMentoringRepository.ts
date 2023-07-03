import { ICreateMentoringDTO } from "../dtos/ICreateMentoring";
import { Mentoring } from "../infra/typeorm/entities/Mentoring";
import { Pagination } from "../infra/typeorm/repository/MentoringRepository";

interface IMentoringRepository {
    create(data: ICreateMentoringDTO): Promise<Mentoring>;
    find(): Promise<Mentoring[]>;
    delete(id: string): Promise<void>;
    update(id: string, data: ICreateMentoringDTO): Promise<Mentoring>;
    findById(id: string): Promise<Mentoring>;
    paginate(page: number, perPage: number): Promise<Pagination>;
}

export { IMentoringRepository };

