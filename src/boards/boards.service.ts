import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { QueryBoardDto } from './dto/query-board.dto';
import { Board } from './interfaces/board.interface';


@Injectable()
export class BoardsService {
    private boards: Board[]=[
        {
            id: 1,
            title: 'First Post',
            content: 'This is the first dummy post.',
            userId: 1,
            createdAt: new Date().toISOString(),
            updateAt: new Date(). toISOString(),
        },
        {
            id: 2,
            title: 'Second Post',
            content: 'This is the second dummy post.',
            userId: 2,
            createdAt: new Date(). toISOString(),
            updateAt: new Date(). toISOString(), 
        },
    ];

    findAll(query: QueryBoardDto): Board[] {
        const { id, userId } =query;

        if(id !==undefined) {
            return this.boards. filter((board) => board.id === id);
        }

        if (userId !== undefined) {
            return this.boards.filter((board) => board.userId === userId);
        }
        return this.boards;
    }

    findOne(id: number): Board {
        const board = this.boards.find((board) => board.id === id);

        if (!board) {
            throw new NotFoundException('Board with id ${id} not found');
        }

        return board;
    }

    create(createBoardDto: CreateBoardDto): Board {
        const newBoard: Board ={
            id: this.boards.length
            ? Math.max(...this.boards.map((board) => board.id)) +1
            :1,
            title: createBoardDto.title,
            content: createBoardDto. content,
            userId: createBoardDto. userId,
            createdAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
        };

        this.boards.push(newBoard);
        return newBoard;
    }
    update(id: number, updateBoarDto: UpdateBoardDto): Board {
        const board = this.findOne(id);

        const updatedBoard: Board = {
            ...board,
            ...UpdateBoardDto,
            updateAt: new Date().toISOString(),
        };

        const index = this.boards.findIndex((board) => board.id === id );
        this.boards[index] = updatedBoard;

        return updatedBoard;
    }

    remove(id: number): { message: string } {
        const index = this.boards.findIndex((board) => board.id === id);

        if (index === -1) {
            throw new NotFoundException('Board with id ${id} not found');
        }
        this.boards.splice(index, 1);

        return {message: 'Board ${id} deleted successfully'};
    }
    }
