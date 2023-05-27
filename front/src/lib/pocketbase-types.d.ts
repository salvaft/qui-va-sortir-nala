/**
 * This file was @generated using pocketbase-typegen
 */

export enum Collections {
	Partidas = 'partidas',
	Rooms = 'rooms',
	Test = 'test',
	Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString;
	created: IsoDateString;
	updated: IsoDateString;
	collectionId: string;
	collectionName: Collections;
	expand?: T;
};

export type AuthSystemFields<T = never> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type PartidasRecord = {
	p1?: RecordIdString;
	p2?: RecordIdString;
	m1?: string;
	m2?: string;
	finished?: boolean;
	winner?: RecordIdString;
};

export type RoomsRecord = {
	p1?: RecordIdString;
	p2?: RecordIdString;
	free?: boolean;
	m1?: string;
	m2?: string;
	winner?: RecordIdString;
	finished?: boolean;
	turn?: RecordIdString;
	next?: RecordIdString;
	comment?: string;
};

export type TestRecord = {
	p1?: RecordIdString;
	p2?: RecordIdString;
	m1?: string;
	m2?: string;
	finished?: boolean;
	winner?: RecordIdString;
};

export type UsersRecord = {
	name?: string;
	avatar?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type PartidasResponse<Texpand = unknown> = Required<PartidasRecord> &
	BaseSystemFields<Texpand>;
export type RoomsResponse<Texpand = unknown> = Required<RoomsRecord> & BaseSystemFields<Texpand>;
export type TestResponse<Texpand = unknown> = Required<TestRecord> & BaseSystemFields<Texpand>;
export type UsersResponse = Required<UsersRecord> & AuthSystemFields;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	partidas: PartidasRecord;
	rooms: RoomsRecord;
	test: TestRecord;
	users: UsersRecord;
};

export type CollectionResponses = {
	partidas: PartidasResponse;
	rooms: RoomsResponse;
	test: TestResponse;
	users: UsersResponse;
};
