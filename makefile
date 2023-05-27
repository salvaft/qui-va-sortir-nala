GOVARS := GOOS=linux CGO_ENABLED=0 GOARCH=amd64 
GOCMD := go build
GODIR := ./pocketbase
GOFLAGS := -a  -C $(GODIR)
DEPS = pocketbase.go
_DEPS = $(patsubst %,$(GODIR)/%,$(DEPS))
TARGETEXEC := pocketbase

$(TARGETEXEC): $(_DEPS) 
	$(GOVARS) $(GOCMD) $(GOFLAGS) -o $@ $(DEPS)

