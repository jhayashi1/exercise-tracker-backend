import {Get, Inject, OperationId, Queries, Route, Tags} from 'tsoa';
import type {ApiEvent} from '..';
import {getRoute} from './get-route';

@Route('route')
export abstract class GetRouteController {
    @Get()
    @OperationId('getRequest')
    @Tags('test')
    static async handler(@Inject() e: ApiEvent, @Queries() q: unknown): Promise<unknown> {
        return await getRoute();
    }
}
