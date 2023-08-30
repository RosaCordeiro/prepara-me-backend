import { ICreateMentoringDTO } from "../dtos/ICreateMentoring";
import { IEditMentoringDTO } from "../dtos/IEditMentoring";
import { Mentoring } from "../infra/typeorm/entities/Mentoring";
import { Pagination } from "../infra/typeorm/repository/MentoringRepository";

interface IMentoringRepository {
    create(data: ICreateMentoringDTO): Promise<Mentoring>;
    find(): Promise<Mentoring[]>;
    delete(id: string): Promise<void>;
    update(id: string, data: IEditMentoringDTO): Promise<Mentoring>;
    findById(id: string): Promise<Mentoring>;
    paginate(page: number, perPage: number): Promise<Pagination>;
    findSchedule(
        userId: string,
        dateBegin: string,
        dateEnd: string,
        type: string
    ): Promise<any>;
    rateMentoring(id: string, idUser: string, rate: number): Promise<void>;
    removeUsers(id: string): Promise<void>;
}

export { IMentoringRepository };
