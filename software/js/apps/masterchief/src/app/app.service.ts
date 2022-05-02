import { Injectable } from '@nestjs/common';
import {Place} from "./place.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";

export class GetDataResponse {
  message: string
  places: Place[]
}

export class GetDataRequest {

}

@QueryHandler(GetDataRequest)
export class GetPlacesHandler implements IQueryHandler<GetDataRequest, GetDataResponse>{
  constructor(
    @InjectRepository(Place)
    private readonly repo: Repository<Place>
  ) {}

  async execute(query: GetDataRequest): Promise<GetDataResponse> {
    const places = await this.repo.find();
    // return Promise.resolve(undefined);
    return {
      message: 'from CQRS!',
      places
    }
  }




}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Place)
    private placesRepository: Repository<Place>
  ) {
  }
  async getData(): Promise<GetDataResponse> {
    const places = await this.placesRepository.find();
    return {message: 'Welcome to masterchief!', places};
  }
}
