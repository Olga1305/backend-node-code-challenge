export interface DtoMapper<Dto, DomainEntity> extends DtoMapperToDomain<Dto, DomainEntity>, DtoMapperToDto<Dto, DomainEntity> {}

export interface DtoMapperToDomain<Dto, DomainEntity> {
    toDomain(dto: Dto): DomainEntity;
}

export interface DtoMapperToDto<Dto, DomainEntity> {
    toDto(domainEntity: DomainEntity): Dto;
}
