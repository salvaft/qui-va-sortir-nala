package main

import (
	"fmt"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/hook"
)

func main() {
	app := pocketbase.New()

	app.OnRecordBeforeUpdateRequest().Add(func(e *core.RecordUpdateEvent) error {
		if e.Collection.Name != "records_pb" {
			return nil
		}
		fmt.Printf("%+v\n", e.Record)
		if e.Record.Get("p1") == "" && e.Record.Get("p2") == "" {
			app.Dao().DeleteRecord(e.Record)
			e.HttpContext.String(200, "OK")
			return hook.StopPropagation
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
